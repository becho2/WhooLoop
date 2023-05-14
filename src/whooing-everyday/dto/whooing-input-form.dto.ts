export class WhooingInputData {
  webhook_url: string;
  input_form: WhooingInputForm;
}

export class WhooingInputForm {
  entry_date: string;
  item: string;
  money: number;
  left: string;
  right: string;
  memo?: string;
}
