export type TaskKind = "word" | "sentence";

export type LessonPolicy = {
  targetText: string;
  taskKind: TaskKind;
  locale: string;
  acceptedResponses: string[];
  acceptedTranscriptAliases: string[];
  policyVersion: string;
  allowRepetitions?: boolean;
  phonetic?: string;
  endingSound?: string;
};

export type PerceptionResult = {
  speechStatus: "clear" | "unclear" | "no_speech";
  transcript: string | null;
  interference: "none_detected" | "suspected";
};

export type AssessmentIssue = {
  kind: "sound" | "stress" | "fluency";
  targetTokenIndex: number;
  suggestionVi: string;
};

export type AssessmentResult = {
  assessability: "usable" | "uncertain" | "unusable";
  contentMatch: "match" | "partial" | "different" | "uncertain";
  pronunciation: "acceptable" | "needs_practice" | "uncertain" | "not_applicable";
  issues: AssessmentIssue[];
  rawModelScore: number | null;
};

export type ContentComparison = "allowed_match" | "omissions_only" | "other";

export type AttemptResult = {
  attemptId: string;
  status: "pass" | "practice" | "retry" | "service_error";
  reason:
    | "acceptable"
    | "pronunciation_needs_practice"
    | "incomplete_reading"
    | "different_content"
    | "no_clear_speech"
    | "poor_recording"
    | "interference"
    | "conflicting_evidence"
    | "uncertain_assessment"
    | "provider_unavailable"
    | "invalid_model_output";
  contentStatus: "matched" | "partial" | "different" | "unknown";
  passed: boolean | null;
  score: number | null;
  scoreType: "none" | "estimated" | "calibrated";
  feedbackVi: string;
  engineVersion: string;
  rubricVersion: string | null;
  calibrationVersion: string | null;
};
