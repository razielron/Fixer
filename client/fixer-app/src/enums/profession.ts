enum Profession { 
    ELECTRICIAN = 'ELECTRICIAN', 
    PLUMBER = 'PLUMBER', 
    CARPENTER = 'CARPENTER', 
    MECHANIC = 'MECHANIC', 
    PAINTER = 'PAINTER', 
    CLEANER = 'CLEANER', 
    GARDENER = 'GARDENER', 
    AC_TECHNICIAN = 'AC_TECHNICIAN', 
    MOVER = 'MOVER', 
    REPAIRER = 'REPAIRER', 
    OTHER = 'OTHER',
  }
  function convertOptionToDisplay(option: string) : string {
    return option 
        .split('_') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
  const professionOptions = [
    { 
        value: 1,
        label: convertOptionToDisplay(Profession.ELECTRICIAN.toString())
    },
    {
        value: 2,
        label: convertOptionToDisplay(Profession.PLUMBER.toString())
    },
    { 
        value: 3,
        label: convertOptionToDisplay(Profession.CARPENTER.toString())
    },
    {
        value: 4,
        label: convertOptionToDisplay(Profession.MECHANIC.toString())
    },
    { 
        value: 5,
        label: convertOptionToDisplay(Profession.PAINTER.toString())
    },
    {
        value: 6,
        label: convertOptionToDisplay(Profession.CLEANER.toString())
    },
    { 
        value: 7,
        label: convertOptionToDisplay(Profession.GARDENER.toString())
    },
    {
        value: 8,
        label: convertOptionToDisplay(Profession.AC_TECHNICIAN.toString())
    },
    {
        value: 9,
        label: convertOptionToDisplay(Profession.MOVER.toString())
    },
    {
        value: 10,
        label: convertOptionToDisplay(Profession.REPAIRER.toString())
    },
    {
        value: 11,
        label: convertOptionToDisplay(Profession.OTHER.toString())
    },
    
]

export{Profession, professionOptions}