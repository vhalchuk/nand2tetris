export type Segment =
  | "local"
  | "argument"
  | "static"
  | "constant"
  | "temp"
  | "pointer"
  | "this"
  | "that";
export type PopSegment = Exclude<Segment, "constant">;
export type ArithmeticOperationType = "add" | "sub" | "neg";
export type LogicalOperationType = "eq" | "gt" | "lt" | "and" | "or" | "not";

export type PushCommand = {
  commandType: "C_PUSH";
  segment: Segment;
  address: number;
};

export type PopCommand = {
  commandType: "C_POP";
  segment: PopSegment;
  address: number;
};

export type ArithmeticCommand = {
  commandType: "C_ARITHMETIC";
  arithmeticOperationType: ArithmeticOperationType;
};

export type LogicalCommand = {
  commandType: "C_LOGICAL";
  logicalOperationType: LogicalOperationType;
};

export type LabelCommand = {
  commandType: "C_LABEL";
  label: string;
};

export type GotoCommand = {
  commandType: "C_GOTO";
  label: string;
};

export type IfGotoCommand = {
  commandType: "C_IF_GOTO";
  label: string;
};

export type CallFuncCommand = {
  commandType: "C_CALL_FUNC";
  functionName: string;
  argumentsCount: number;
};

export type DeclareFuncCommand = {
  commandType: "C_DECLARE_FUNC";
  functionName: string;
  localsCount: number;
};

export type ReturnCommand = {
  commandType: "C_RETURN";
};

export type Command =
  | PushCommand
  | PopCommand
  | ArithmeticCommand
  | LogicalCommand
  | LabelCommand
  | GotoCommand
  | IfGotoCommand
  | CallFuncCommand
  | DeclareFuncCommand
  | ReturnCommand;
