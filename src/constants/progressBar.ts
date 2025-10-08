export const PROGRESS_BAR_COPY = {
  status: {
    current: 'Current step',
    complete: 'Completed step',
    upcoming: 'Upcoming step',
  },
  navLabel: 'Application progress',
  stepIndicatorTemplate: 'Step {step} of {total} – {status}',
} as const;
