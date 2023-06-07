export class WhooingInputData {
  transaction_idx: number;
  webhook_token: string;
  entry_date: string;
  item: string;
  money: number;
  left: string;
  right: string;
  memo?: string;
}

export class WhooingInputForm {
  entry_date: string;
  item: string;
  money: number;
  left: string;
  right: string;
  memo?: string;
}
