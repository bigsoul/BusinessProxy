export default interface IFile {
  id: string;
  raportId: string;
  contractId: string;
  type: number;
  loadedDraft: boolean;
  loadedOriginal: boolean;
  name: string;
}
