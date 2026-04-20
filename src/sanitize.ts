import * as path from 'path';

export function assertWithinWorkspaceOrTempDirectory(resolvedPath: string, inputName: string, workspace: string): void {
  const normalizedResolved = path.resolve(resolvedPath);
  const normalizedWorkspace = path.resolve(workspace);

  const runnerTemp = process.env.RUNNER_TEMP;
  const normalizedRunnerTemp = runnerTemp ? path.resolve(runnerTemp) : null;

  if (!isWithinPath(normalizedResolved, normalizedWorkspace)
    && !isWithinPath(normalizedResolved, normalizedRunnerTemp)) {
    throw new Error(`Input '${inputName}' resolves outside the workspace and temp directory: ${resolvedPath}`);
  }
}

export function assertPathsWithinWorkspace(value: string, inputName: string, workspace: string): void {
  value.split(/[;]/).forEach(segment => {
    const trimmed = segment.trim();
    if (trimmed.length > 0) {
      assertWithinWorkspaceOrTempDirectory(path.resolve(workspace, trimmed), inputName, workspace);
    }
  });
}

export function validateCustomSetting(setting: string): string | null {
  const trimmed = setting.trim();
  if (trimmed.length === 0) {
     return null;
  }
  
  if (trimmed.startsWith('-') || !trimmed.includes('=')) {
    return null;
  }

  return trimmed;
}

function isWithinPath(normalizedPath: string|null, normalizedTargetPath: string|null): boolean {
  if (normalizedPath === null || normalizedTargetPath === null) {
    return false;
  }

  return normalizedPath === normalizedTargetPath || normalizedPath.startsWith(normalizedTargetPath + path.sep);
}
