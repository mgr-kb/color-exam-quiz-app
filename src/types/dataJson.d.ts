declare module "@/data/data.json" {
  interface ColorData {
    colorCode: string;
    colorName: string;
    colorAlias: string;
    systemColorName: string;
    munsellValue: string;
    colorGroup: string;
  }
  interface ExamData {
    twoClass: ColorData[];
  }
  const data: ExamData;

  export default data;
}
