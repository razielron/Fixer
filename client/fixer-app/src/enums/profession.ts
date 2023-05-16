const enum Profession { 
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

  const professionOptions = [
    { 
        value: 1,
        label: Profession.ELECTRICIAN.toString()
    },
    {
        value: 2,
        label: Profession.PLUMBER.toString()
    },
    { 
        value: 3,
        label: Profession.CARPENTER.toString()
    },
    {
        value: 4,
        label: Profession.MECHANIC.toString()
    },
    { 
        value: 5,
        label: Profession.PAINTER.toString()
    },
    {
        value: 6,
        label: Profession.CLEANER.toString()
    },
    { 
        value: 7,
        label: Profession.GARDENER.toString()
    },
    {
        value: 8,
        label: Profession.AC_TECHNICIAN.toString()
    },
    {
        value: 9,
        label: Profession.MOVER.toString()
    },
    {
        value: 10,
        label: Profession.REPAIRER.toString()
    },
    {
        value: 11,
        label: Profession.OTHER.toString()
    },
    
]

export{Profession, professionOptions}