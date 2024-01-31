function Field({ panel, onClick }) {
    return (
      <div className={`panel ${panel.type}`} onClick={onClick}>
        <img 
          className="panel-image" 
          src={`/images/${panel.type}.png`} 
          alt={`${panel.type}`} 
        />
      </div>
    )
  }
  
  export default Field;