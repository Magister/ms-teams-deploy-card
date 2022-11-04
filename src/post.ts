import {getInput, info, setFailed} from "@actions/core";
import {formatAndNotify, getWorkflowRunStatus} from "./utils";

try {
  // setTimeout to give time for Github API to show up the final conclusion
  setTimeout(async () => {
    const showCardOnExit = getInput(`show-on-exit`).toLowerCase() === "true";
    const showCardOnFailure = getInput(`show-on-failure`).toLowerCase() === "true";
    const ignoreCancel = getInput("ignore-cancel").toLowerCase() === "true";

    const workflowRunStatus = await getWorkflowRunStatus();
    if (workflowRunStatus.conclusion === 'cancelled' && ignoreCancel) {
      info('Configured to not show card upon job cancel.')
    } else if (
      (showCardOnExit && !showCardOnFailure) ||
      (showCardOnFailure && workflowRunStatus.conclusion !== "success")
    ) {
      formatAndNotify(
        "exit",
        workflowRunStatus.conclusion || 'unknown',
        workflowRunStatus.elapsedSeconds
      );
    } else {
      info("Configured to not show card upon job exit.");
    }
  }, 2000);
} catch (error) {
  let message
  if (error instanceof Error) {
    message = error.message
  } else {
    message = String(error)
  }
  setFailed(message);
}
