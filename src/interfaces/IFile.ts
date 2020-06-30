export default interface IFile {
  id: string;
  reportId: string;
  contractId: string;
  type: number;
  loadedDraft: boolean;
  loadedOriginal: boolean;
  name: string;
}
