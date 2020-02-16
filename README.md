# ReportGenerator

[ReportGenerator](https://github.com/danielpalme/ReportGenerator) converts coverage reports generated by OpenCover, dotCover, Visual Studio, NCover, Cobertura, JaCoCo, Clover, gcov or lcov into human readable reports in various formats.

## Usage

```yml
- name: ReportGenerator
  uses: danielpalme/reportgenerator@v4.4.7
  with:
    reports: 'coverage.xml' # REQUIRED # The coverage reports that should be parsed (separated by semicolon). Globbing is supported.
    targetdir: 'coveragereport' # REQUIRED # The directory where the generated report should be saved.
    reporttypes: 'HtmlInline;Cobertura' # The output formats and scope (separated by semicolon) Values: Badges, Cobertura, CsvSummary, Html, HtmlChart, HtmlInline, HtmlInline_AzurePipelines, HtmlInline_AzurePipelines_Dark, HtmlSummary, Latex, LatexSummary, lcov, MHtml, PngChart, SonarQube, TeamCitySummary, TextSummary, Xml, XmlSummary
    sourcedirs: '' # Optional directories which contain the corresponding source code (separated by semicolon). The source directories are used if coverage report contains classes without path information.
    historydir: '' # Optional directory for storing persistent coverage information. Can be used in future reports to show coverage evolution.
    plugins: '' # Optional plugin files for custom reports or custom history storage (separated by semicolon).
    assemblyfilters: '+' # Optional list of assemblies that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    classfilters: '+' # Optional list of classes that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    filefilters: '+' # Optional list of files that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.
    verbosity: 'Info' # The verbosity level of the log messages. Values: Verbose, Info, Warning, Error, Off
    tag: '${{ github.run_number }}_${{ github.run_id }}' # Optional tag or build version.
```