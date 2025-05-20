export const formatLabel = (label: string): string => {
    return label
      .replace(/([A-Z])/g, " $1") 
      .replace(/^./, str => str.toUpperCase()) 
      .trim(); 
  };
  