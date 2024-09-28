# ReportGenerator

[ReportGenerator](https://github.com/danielpalme/ReportGenerator) converts coverage reports generated by OpenCover, dotCover, Visual Studio, NCover, Cobertura, JaCoCo, Clover, gcov or lcov into human readable reports in various formats.

## Usage
Use the online [configuration tool](https://reportgenerator.io/usage) to get started quickly.  
The more advanced settings are documented in the [wiki](https://github.com/danielpalme/ReportGenerator/wiki/Settings). They can be applied via the `customSettings` parameter.

```yml
- name: Setup .NET Core # Required to execute ReportGenerator
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: 8.x
    dotnet-quality: 'ga'

- name: ReportGenerator
  uses: danielpalme/ReportGenerator-GitHub-Action@5.3.10
  with:
    reports: 'coverage.xml' # REQUIRED # The coverage reports that should be parsed (separated by semicolon). Globbing is supported.
    targetdir: 'coveragereport' # REQUIRED # The directory where the generated report should be saved.
    reporttypes: 'HtmlInline;Cobertura' # The output formats and scope (separated by semicolon) Values: Badges, Clover, Cobertura, OpenCover, CsvSummary, Html, Html_Dark, Html_Light, Html_BlueRed, HtmlChart, HtmlInline, HtmlInline_AzurePipelines, HtmlInline_AzurePipelines_Dark, HtmlInline_AzurePipelines_Light, HtmlSummary, Html_BlueRed_Summary, JsonSummary, CodeClimate, Latex, LatexSummary, lcov, MarkdownSummary, MarkdownAssembliesSummary, MarkdownSummaryGithub, MarkdownDeltaSummary, MHtml, SvgChart, SonarQube, TeamCitySummary, TextSummary, TextDeltaSummary, Xml, XmlSummary
    sourcedirs: '' # Optional directories which contain the corresponding source code (separated by semicolon). The source directories are used if coverage report contains classes without path information.
    historydir: '' # Optional directory for storing persistent coverage information. Can be used in future reports to show coverage evolution.
    plugins: '' # Optional plugin files for custom reports or custom history storage (separated by semicolon).
    assemblyfilters: '+*' # Optional list of assemblies that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    classfilters: '+*' # Optional list of classes that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    filefilters: '+*' # Optional list of files that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    riskhotspotassemblyfilters: '+*' # Optional list of assemblies that should be included or excluded in the risk hotspots. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    riskhotspotclassfilters: '+*' # Optional list of classes that should be included or excluded in the risk hotspots. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    verbosity: 'Info' # The verbosity level of the log messages. Values: Verbose, Info, Warning, Error, Off
    title: '' # Optional title.
    tag: '${{ github.run_number }}_${{ github.run_id }}' # Optional tag or build version.
    license: '' # Optional license for PRO version. Get your license here: https://reportgenerator.io/pro
    customSettings: '' # Optional custom settings (separated by semicolon). See: https://github.com/danielpalme/ReportGenerator/wiki/Settings.
    toolpath: 'reportgeneratortool' # Default directory for installing the dotnet tool.

- name: Upload coverage report artifact
  uses: actions/upload-artifact@v4
  with:
    name: CoverageReport # Artifact name        
    path: coveragereport # Directory containing files to upload

- name: Add comment to PR # Only applicable if 'MarkdownSummaryGithub' or one of the other Markdown report types is generated
  if: github.event_name == 'pull_request'
  run: gh pr comment $PR_NUMBER --body-file coveragereport/SummaryGithub.md # Adjust path and filename if necessary
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    PR_NUMBER: ${{ github.event.number }}
    
- name: Publish coverage in build summary # Only applicable if 'MarkdownSummaryGithub' or one of the other Markdown report types is generated
  run: cat coveragereport/SummaryGithub.md >> $GITHUB_STEP_SUMMARY # Adjust path and filename if necessary
  shell: bash
```
