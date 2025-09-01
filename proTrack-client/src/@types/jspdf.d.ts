declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: string[][];
      startY?: number;
      styles?: {
        fontSize?: number;
        cellPadding?: number;
      };
      headStyles?: {
        fillColor?: number[];
        textColor?: number;
        fontStyle?: string;
      };
    }) => jsPDF;
  }
}

declare module "jspdf-autotable" {
  // Este módulo adiciona o método autoTable ao jsPDF
}
