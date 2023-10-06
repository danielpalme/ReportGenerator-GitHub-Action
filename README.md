# ReportGenerator

[ReportGenerator](https://github.com/danielpalme/ReportGenerator) converts coverage reports generated by OpenCover, dotCover, Visual Studio, NCover, Cobertura, JaCoCo, Clover, gcov or lcov into human readable reports in various formats.

## Usage
Use the online [configuration tool](https://reportgenerator.io/usage) to get started quickly.

```yml
- name: Setup .NET Core # Required to execute ReportGenerator
  uses: actions/setup-dotnet@v3
  with:
    dotnet-version: 6.x
    dotnet-quality: 'ga'

- name: ReportGenerator
  uses: danielpalme/ReportGenerator-GitHub-Action@5.1.26
  with:
    reports: 'coverage.xml' # REQUIRED # The coverage reports that should be parsed (separated by semicolon). Globbing is supported.
    targetdir: 'coveragereport' # REQUIRED # The directory where the generated report should be saved.
    reporttypes: 'HtmlInline;Cobertura' # The output formats and scope (separated by semicolon) Values: Badges, Clover, Cobertura, OpenCover, CsvSummary, Html, Html_Dark, Html_Light, Html_BlueRed, HtmlChart, HtmlInline, HtmlInline_AzurePipelines, HtmlInline_AzurePipelines_Dark, HtmlInline_AzurePipelines_Light, HtmlSummary, Html_BlueRed_Summary, JsonSummary, Latex, LatexSummary, lcov, MarkdownSummary, MarkdownSummaryGithub, MarkdownDeltaSummary, MHtml, SvgChart, SonarQube, TeamCitySummary, TextSummary, TextDeltaSummary, Xml, XmlSummary
    sourcedirs: '' # Optional directories which contain the corresponding source code (separated by semicolon). The source directories are used if coverage report contains classes without path information.
    historydir: '' # Optional directory for storing persistent coverage information. Can be used in future reports to show coverage evolution.
    plugins: '' # Optional plugin files for custom reports or custom history storage (separated by semicolon).
    assemblyfilters: '+*' # Optional list of assemblies that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    classfilters: '+*' # Optional list of classes that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    filefilters: '+*' # Optional list of files that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    verbosity: 'Info' # The verbosity level of the log messages. Values: Verbose, Info, Warning, Error, Off
    title: '' # Optional title.
    tag: '${{ github.run_number }}_${{ github.run_id }}' # Optional tag or build version.
    license: '' # Optional license for PRO version. Get your license here: https://reportgenerator.io/pro
    customSettings: '' # Optional custom settings (separated by semicolon). See: https://github.com/danielpalme/ReportGenerator/wiki/Settings.
    toolpath: 'reportgeneratortool' # Default directory for installing the dotnet tool.

- name: Upload coverage report artifact
  uses: actions/upload-artifact@v2.2.3
  with:
    name: CoverageReport # Artifact name        
    path: coveragereport # Directory containing files to upload
```
