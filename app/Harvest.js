function Harvest({ count }) {
    return (
      <div className="harvest">
        <div>米：{count.rice}</div>
        <div>麦：{count.wheat}</div>
        <div>卵：{count.egg}</div>
        <div>牛乳：{count.milk}</div>
      </div>
    )
  }
  
  export default Harvest;