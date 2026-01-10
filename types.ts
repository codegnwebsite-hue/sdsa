
export interface UserInfo {
  userId: string | null;
  userName: string | null;
}

export enum VerificationStep {
  START = 1,
  STEP_ONE = 1,
  STEP_TWO = 2,
  STEP_THREE = 3,
  COMPLETE = 4
}

export interface VerificationState {
  currentStep: VerificationStep;
  isVerifying: boolean;
  completed: boolean;
}
