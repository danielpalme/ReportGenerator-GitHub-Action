import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

const VERSION = '5.4.9';

async function run() {
  try {
    core.info("Detecting .NET Core SDK");

    let output = '';
    let resultCode = 0;
    let toolpath = core.getInput('toolpath');

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
      core.info("- name: Setup .NET Core");
      core.info("  uses: actions/setup-dotnet@v3");
      core.info("  with");
      core.info("    dotnet-version: 8.x");
      core.info("    dotnet-quality: 'ga'");
      return;
    }
    
    core.info("Detected .NET Core SDK version '" + output + "'");

    if (fs.existsSync(toolpath)) {
      core.info("ReportGenerator global tool already installed");
    } else {
      core.info("Installing ReportGenerator global tool (https://www.nuget.org/packages/dotnet-reportgenerator-globaltool)");

      output = '';
      resultCode = 0;
  
      try {
        resultCode = await exec.exec(
          'dotnet',
          ['tool', 'install', 'dotnet-reportgenerator-globaltool', '--tool-path', toolpath, '--version', VERSION, '--ignore-failed-sources'],
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
      const workingdir = (core.getInput('workingdir') || '').trim();

      let targetdir = (core.getInput('targetdir') || '');
      let historydir = (core.getInput('historydir') || '');
      let sourcedirs = (core.getInput('sourcedirs') || '');
      let reports = (core.getInput('reports') || '');

      if (workingdir.length > 0) {
        if (targetdir.length > 0 && !path.isAbsolute(targetdir)) {
          targetdir = path.join(workingdir, targetdir);
        }
        if (historydir.length > 0 &&!path.isAbsolute(historydir)) {
          historydir = path.join(workingdir, historydir);
        }
        if (sourcedirs.length > 0) {
          let updatedSourcedirs = '';

          sourcedirs.split(/[,;]/).forEach(sourcedir => {
            if (!path.isAbsolute(sourcedir)) {
              sourcedir = path.join(workingdir, sourcedir);
            }

            if (updatedSourcedirs.length > 0) {
              updatedSourcedirs += ';';
            }

            updatedSourcedirs += sourcedir;
          });

          sourcedirs = updatedSourcedirs;
        }
        if (reports.length > 0) {
          let updatedReports = '';

          reports.split(/[,;]/).forEach(report => {
            if (!path.isAbsolute(report)) {
              report = path.join(workingdir, report);
            }

            if (updatedReports.length > 0) {
              updatedReports += ';';
            }

            updatedReports += report;
          });

          reports = updatedReports;
        }
      }

      const args = [
        '-reports:' + reports,
        '-targetdir:' + targetdir,
        '-reporttypes:' + (core.getInput('reporttypes') || ''),
        '-sourcedirs:' + sourcedirs,
        '-historydir:' + historydir,
        '-plugins:' + (core.getInput('plugins') || ''),
        '-assemblyfilters:' + (core.getInput('assemblyfilters') || ''),
        '-classfilters:' + (core.getInput('classfilters') || ''),
        '-filefilters:' + (core.getInput('filefilters') || ''),
        '-riskhotspotassemblyfilters:' + (core.getInput('riskhotspotassemblyfilters') || ''),
        '-riskhotspotclassfilters:' + (core.getInput('riskhotspotclassfilters') || ''),
        '-verbosity:' + (core.getInput('verbosity') || ''),
        '-title:' + (core.getInput('title') || ''),
        '-tag:' + (core.getInput('tag') || ''),
        '-license:' + (core.getInput('license') || '')
      ];
      
      const customSettings = (core.getInput('customSettings') || '');

      if (customSettings.length > 0) {
          customSettings.split(/[,;]/).forEach(setting => {
              args.push(setting.trim());
          });
      }

      resultCode = await exec.exec(
        toolpath + '/reportgenerator',
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
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();