export interface TypeInput {
  TextLabel: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TypeButton {
  Text: string;
  type: "submit" | "button" | "reset";
  onClick?: () => void;
}
