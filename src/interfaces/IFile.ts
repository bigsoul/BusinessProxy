export default interface IFile {
  id: string;
  name: string;
  type: number;
  loadedDraft: boolean;
  loadedOriginal: boolean;
  reportId: string;
}
