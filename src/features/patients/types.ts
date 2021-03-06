export interface Patient {
  ID: string;
  date_of_birth?: Date;
  first?: string;
  last?: string;
  name: string;
}

export interface Vaccinator {
  first_name: string;
  last_name: string;
}
export interface Transaction {
  ID: string;
  itemLine: ItemLine;
  item_name: string;
  medicineAdministrator?: Vaccinator;
  quantity: number;
}
export interface ItemLine {
  item: Item;
}
export interface Item {
  code: string;
  doses: number;
  is_vaccine: boolean;
}

export interface PatientHistory {
  ID: string;
  confirm_date: string;
  transLines: Transaction[];
}

export type SearchParameters = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
};
