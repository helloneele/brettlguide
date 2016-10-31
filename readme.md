# brettlguide.at
## Allgemein
`npm install` ausführen um alle `node_modules` aus der `package.json` zu installieren.

### Ordnerstruktur
* __/__
* __assets__
  * __css__ (alle rohen CSS Dateien)
  * __styleguide__ (Template Datei und Template Stylesheet)
* __build__ (Ordner der hinterher deployed wird)
  * __styleguide__ (kompilierter Styleguide)
* __node_modules__
* __gulpfile.js__ (alle Gulp Tasks)
* __package.json__ (npm Package-Datei)

### Kompilieren
Mit `npm install` wird automatisch auch Gulp installiert, siehe `gulpfile.js`.  
Mit `gulp` startet automatisch der watch Task, der bei einer Änderung in den CSS-Files automatisch kompiliert.

## Styleguide
Wir verwenden [postcss styleguide](https://github.com/morishitter/postcss-style-guide).  

In den Stylesheets kann zwischen
```
/*
@styleguide

@title Typography

<<CODE>>

*/
```
[Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) geschrieben werden.  

Um Code-Beispiele zu geben zwei Tabstopps zum Einrücken verwenden.  

__Achtung__ bei den Colors funktioniert das etwas anders, nicht wundern.
