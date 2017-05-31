# TODO

## Dev Setup
* **npm script `start` hinzufügen als Alias für `gulp`, damit ist nur lokale gulp Version notwendig (`node_modules/.bin/`)**  
🏂 *ist angepasst*

* **lokal starten wäre toll** 🚀

## Stylesheets
**Gute Strukturierung, gute Dokumentation
Eigene Files -> Übersichtlich
BEM sauber umgesetzt**  
🏂 *danke :)*

## Templates

**Templates sind strukturiert**

**Manche Tags werden nicht geschlossen, Beispiel slopes.hbs, 27**  
🏂 *werden schon geschlossen, dort ist ein if um das div, weil sich je nach piste die klasse des div's ändert* 😊

## JavaScript

### app.js

**Nicht benutzter Import**  
🏂 *ist gelöscht*

**map() mit konstanten Koordinaten, wo liegen die genau?**  
🏂 *Stadt Salzburg, bis eigene Koordinaten ermittelt wurden*
*--> map wird von anfang an geladen und nicht erst, wenn durch geolocation die position ermittelt wurde*

### chart.js

**Klasse Schnee, Methode Schwierigkeit, Methode auslastung
-> Mischung Deutsch und Englisch nicht logisch**  
🏂 *ist angepasst*

**let und var - konsistente Benennung**  
🏂 *ist angepasst*

### detectLocation.js

**Passt gut.**


### getObject.js

**Wir waren uns nicht sicher welches Objekt das sein soll. Erzeugt das die IDs für Slopes, Huts, ...?**


### handlebarHelpers.js

**Helper: emptyBemerkung ^^**  
🏂 *schon umbenannt*

**Sonst sehr gut**


### map.js

**Müssen alle Layer beim Zoom neu geladen werden? Was verändert sich dabei?**  
🏂 *Layer werden beim Zoom nicht neu geladen. Zu Anfang wird nur der Skigebiete-Layer geladen um die Ladezeit zu verbessern, die restlichen Layer werden EINMALIG geladen, wenn der Zoom einen bestimmten Wert überschreitet*

**Gute Variablen- und Methodenbenennung**


### routing.js

**Alle Templates in einem Objekt, gefällt uns sehr gut**


### scrollButtons.js

**let und var - konsistente Benennung**  
🏂 *ist angepasst*


## Allgemein

**Alle Bemängelungen sind Kleinigkeiten, sonst fühlt sich das Projekt gut an -> A+ :D**  
🏂 *danke :)*