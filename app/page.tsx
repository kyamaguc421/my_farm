'use client';

import React, { useState, useEffect } from 'react';
import Field from './Field';
import Button from './Button';
import Harvest from './Harvest';

export default function HomePage() {
  const [fields, setFields] = useState(() => {
    return new Array(10).fill(
      new Array(20).fill({
        type: "荒野",
        plantedTime: null,
        crop: null
      })
    );
  });
 
  const [harvestCount, setHarvestCount] = useState({
    rice: 0, wheat: 0, egg: 0, milk: 0
  });

  useEffect(() => {  // useEffectを使ったライフサイクル処理
    const unitTime = 6000;
    const interval = setInterval(() => {
      setFields(fields =>
        fields.map(row =>
          row.map(field => {
            // ground of type 荒野 or 耕地 doesn't change over time
            if (field.type === "荒野" || field.type === "耕地" || field.type === "草地") return field;

            // change state based on time since planted
            const timeSincePlanted = Date.now() - new Date(field.plantedTime).getTime();
            if (field.crop === "rice" || field.crop === "wheat") {
              if (timeSincePlanted >= unitTime * 3) {
                return { ...field, type: `収穫_${field.crop}` };
              } else if (timeSincePlanted >= unitTime * 2) {
                return { ...field, type: `成長_${field.crop}` };
              } else if (timeSincePlanted >= unitTime) {
                return { ...field, type: "発芽" };
              } else {
                return field;
              }
            } else {
              if (timeSincePlanted >= unitTime * 3) {
                if (field.crop === "milk") {
                  return { ...field, type: "牛乳" };
                } else {
                  return { ...field, type: "卵" };
                }
              } else if (timeSincePlanted >= unitTime * 2) {
                return { ...field, type: `満腹_${field.crop}` };
              } else if (timeSincePlanted >= unitTime) {
                return { ...field, type: `八分目_${field.crop}` };
              } else {
                return field;
              }
            }
          })
        )
      );
    }, 1000);

    // cleanup on component unmount
    return () => clearInterval(interval);

  }, []);

  const [selectedAction, setSelectedAction] = useState(null);

  const handleClick = (i, j) => () => {
    // クリックされたパネルの位置を取得
    let newFields = JSON.parse(JSON.stringify(fields));
    let selectedPanel = {...newFields[i][j]};
  
    switch (selectedAction) {
      case '耕す':
        if (selectedPanel.type === "荒野") selectedPanel.type = '耕地';
        break;
      case '米をまく':
        if (selectedPanel.type === "耕地") {
          selectedPanel.type = '播種';
          selectedPanel.crop = 'rice';
          selectedPanel.plantedTime = Date.now();
        }
        break;
      case '麦をまく':
        if (selectedPanel.type === "耕地") {
          selectedPanel.type = '播種';
          selectedPanel.crop = 'wheat';
          selectedPanel.plantedTime = Date.now();
        }
        break;
      case '収穫する':
        if (selectedPanel.type.startsWith("収穫")) {
          const currentCrop = selectedPanel.crop;
          setHarvestCount(prevCount => ({...prevCount, [currentCrop]: prevCount[currentCrop] + 1}));
          selectedPanel.type = '耕地';
          selectedPanel.crop = null;
        }
        break;
      case '草地にする':
        if (selectedPanel.type === "荒野") selectedPanel.type = '草地';
        break;
      case '牛を放牧':
        if (selectedPanel.type === "草地") {
          selectedPanel.type = '空腹_milk';
          selectedPanel.crop = 'milk';
          selectedPanel.plantedTime = Date.now();
        }
        break;
      case '鶏を放牧':
        if (selectedPanel.type === "草地") {
          selectedPanel.type = '空腹_egg';
          selectedPanel.crop = 'egg';
          selectedPanel.plantedTime = Date.now();
        }
        break;
      case '搾乳する':
        if (selectedPanel.type === "牛乳") {
          setHarvestCount(prevCount => ({...prevCount, [selectedPanel.crop]: prevCount[selectedPanel.crop] + 1}));
          selectedPanel.type = '空腹_milk';
          selectedPanel.crop = 'milk';
          selectedPanel.plantedTime = Date.now();
        }
        break;
      case '採卵する':
        if (selectedPanel.type === "卵") {
          setHarvestCount(prevCount => ({...prevCount, [selectedPanel.crop]: prevCount[selectedPanel.crop] + 1}));
          selectedPanel.type = '空腹_egg';
          selectedPanel.crop = 'egg';
          selectedPanel.plantedTime = Date.now();
        }
        break;
      default:
        break;
    }
  
    newFields[i][j] = selectedPanel;
    setFields(newFields);
  };

  return (
    <div>
      <div className="btnContainer">
        <Button onClick={() => setSelectedAction('耕す')}>耕す</Button>
        <Button onClick={() => setSelectedAction('米をまく')}>米をまく</Button>
        <Button onClick={() => setSelectedAction('麦をまく')}>麦をまく</Button>
        <Button onClick={() => setSelectedAction('収穫する')}>収穫する</Button>
      </div>
      <div className="btnContainer">
        <Button onClick={() => setSelectedAction('草地にする')}>草地にする</Button>
        <Button onClick={() => setSelectedAction('牛を放牧')}>牛を放牧</Button>
        <Button onClick={() => setSelectedAction('鶏を放牧')}>鶏を放牧</Button>
        <Button onClick={() => setSelectedAction('搾乳する')}>搾乳する</Button>
        <Button onClick={() => setSelectedAction('採卵する')}>採卵する</Button>
      </div>

      <div className="grid">
        {fields.map((row, i) =>
          row.map((panel, j) => (
            <Field 
              key={`${i}-${j}`} 
              panel={panel}
              onClick={handleClick(i, j)}
            />
          ))
        )}
      </div>

      <Harvest count={harvestCount} />
    </div>
  );
  
}
