import * as path from 'path';

export function assertWithinWorkspace(resolvedPath: string, inputName: string, workspace: string): void {
  const normalizedResolved = path.resolve(resolvedPath);
  const normalizedWorkspace = path.resolve(workspace);
  if (normalizedResolved !== normalizedWorkspace
      && !normalizedResolved.startsWith(normalizedWorkspace + path.sep)) {
    throw new Error(`Input '${inputName}' resolves outside the workspace: ${resolvedPath}`);
  }
}

export function assertPathsWithinWorkspace(value: string, inputName: string, workspace: string): void {
  value.split(/[;]/).forEach(segment => {
    const trimmed = segment.trim();
    if (trimmed.length > 0) {
      assertWithinWorkspace(path.resolve(workspace, trimmed), inputName, workspace);
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
