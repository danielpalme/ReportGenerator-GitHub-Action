import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

const VERSION = '4.4.7';

async function run() {
  try {
    core.info("Detecting .NET Core SDK");

    let output = '';
    let resultCode = 0;

    try {
      resultCode = await exec.exec(
        'dotnet',
        ['--version'],
        {
          listeners: {
            stdout: (data: Buffer) => {
              output += data.toString();
            }
          }
        }
      );
    } catch (error) {
      core.setFailed(".NET Core SDK is not available.");
      core.info("Please install with the following command in your YAML file:");
      core.info("- uses: actions/setup-dotnet@v1");
      core.info("  with");
      core.info("    dotnet-version: '3.1.100'");
      return;
    }
    
    core.info("Detected .NET Core SDK version '" + output + "'");

    if (fs.existsSync('reportgeneratortool')) {
      core.info("ReportGenerator global tool already installed");
    } else {
      core.info("Installing ReportGenerator global tool (https://www.nuget.org/packages/dotnet-reportgenerator-globaltool)");

      output = '';
      resultCode = 0;
  
      try {
        resultCode = await exec.exec(
          'dotnet',
          ['tool', 'install', 'dotnet-reportgenerator-globaltool', '--tool-path', 'reportgeneratortool', '--version', VERSION],
          {
            listeners: {
              stdout: (data: Buffer) => {
                output += data.toString();
              }
            }
          }
        );
      } catch (error) {
        core.setFailed("Failed to install ReportGenerator global tool");
        return;
      }
  
      core.info("Successfully installed ReportGenerator global tool");
    }
    

    core.info("Executing ReportGenerator");

    output = '';
    resultCode = 0;

    try {
      let args = [
        '-reports:' + (core.getInput('reports') || ''),
        '-targetdir:' + (core.getInput('targetdir') || ''),
        '-reporttypes:' + (core.getInput('reporttypes') || ''),
        '-sourcedirs:' + (core.getInput('sourcedirs') || ''),
        '-historydir:' + (core.getInput('historydir') || ''),
        '-plugins:' + (core.getInput('plugins') || ''),
        '-assemblyfilters:' + (core.getInput('assemblyfilters') || ''),
        '-classfilters:' + (core.getInput('classfilters') || ''),
        '-filefilters:' + (core.getInput('filefilters') || ''),
        '-verbosity:' + (core.getInput('verbosity') || ''),
        '-tag:' + (core.getInput('tag') || '')
      ];

      resultCode = await exec.exec(
        'reportgeneratortool/reportgenerator',
        args,
        {
          listeners: {
            stdout: (data: Buffer) => {
              output += data.toString();
            }
          }
        }
      );
    } catch (error) {
      core.setFailed("Failed to execute ReportGenerator global tool");
      return;
    }

    core.info("Successfully executed ReportGenerator");




  } catch (error) {
    core.setFailed(error.message);
  }
}

run();