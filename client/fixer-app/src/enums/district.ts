enum District { 
    SOUTH = 'SOUTH', 
    CENTER = 'CENTER', 
    NORTH = 'NORTH', 

  }
  function convertOptionToDisplay(option: string) : string {
    return option 
        .split('_') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
  const districtOptions = [
    { 
        value: 1,
        label: convertOptionToDisplay(District.SOUTH.toString())
    },
    {
        value: 2,
        label: convertOptionToDisplay(District.CENTER.toString())
    },
    { 
        value: 3,
        label: convertOptionToDisplay(District.NORTH.toString())
    },
        
]

export{District, districtOptions}