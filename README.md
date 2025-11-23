# CraftBeerPi4 User Interface

After installation the plugin UI is available under to following url
http://localhost:8000#

## Build Web App

```npm start``` for testing the web app

- Server needs to be started on the same host and UI is accessible via http://localhost:3000

```npm run build``` to build the webapp

## Install Plugin for Development

```python3 setup.py develop```

## Package Plugin 

```python3 setup.py sdist```

### Changelog

- 12.11.25: (0.4.0) 
    - Add pyproject.toml file to support pip 25.3+.
    - Change sensor value in case of date from moment to string (might reduce memory usage).
    - Use cookies to determine current dashboard per browser in order to prevent false dashboard saving function if user is using multiple devices.
    - Check free memory every five minutes if dashboard is opened and reload page (without cache usage) if memory is below defined threshold. (This addresses increasing memory consumption with time). Memory leak still to be identified.
    - Use output value as alternative (Alternative actor plugin required to ensure higher resolution) instead of power (0-100%).
    - Preconnect to google fonts.
    - Define alternative local fonts to speed up UI if internet connection is not available.
    - Add scrollbar if Fermentersteps widget is not heigh enough to display all steps.
    - Allow SG as unit for ispindle plugin.
- 11.03.25: (0.3.18.3) Fix maxheight property variable name for steps and fermentersteps widget
- 09.03.25: (0.3.18.2) Fix bugs #60, #61 and #62. Thanks to https://github.com/Corginyan
- 08.03.25: (0.3.18.1) Minor tweaks for Spindle data pages
- 16.02.25: (0.3.18) Add Spindle data pages (iSpindle plugin required)
- 21.08.24: (0.3.17.1) Update power value on power slider, if button action was used to adjust power
- 01.08.24: (0.3.17) Fixed Bug for pipe color for existing pipes
- 08.07.24: (0.3.16) Change position of notification information in tab title. Add options to pipes (opaqueness, width, color). Add progress bar to actor button for power display and for progress on compressor actor plugin
- 01.07.24: (0.3.15) Update Brewfather API calls to V2 API, Add information about # of notifications to tab title
- 06.06.24: (0.3.14.rc0) Some internal adaptions which require also server version 4.4.1.rc0 (Renaming of CustomSVG properties)
- 31.05.24: (0.3.14.a7) Added actor dependency possibility to CustomSVG (Different SVG to be displayed depending on actor status). Activated Badge icon to display past 100 notifications
- 28.05.24: (0.3.14.a3) Test on different color of sensor value if value is to far from target
- 24.05.24: (0.3.14.a2) Fixed error in download log introduced with 0.3.14.a1
- 10.05.24: (0.3.14.a1) Add date in front of filename for backup download
- 12.01.24: (0.3.13) Variable dashboard grid width in edit mode and some fixes
- 31.05.23: (0.3.12) Change version to release
- 31.05.23: (0.3.12.rc1) Added various tooltips and fixed issue if fermenter recipe contained special characters (-> will be automatically replaced). Option on analytics page to delete all logs
- 17.04.23: (0.3.12.a5) Added selection option to settings page for global plugin settings, Option to remove obsolete global settings on system page.
- 18.03.23: (0.3.11) Added play buzzer option to web interface, some fixes in grafana widget.pip install
- 10.03.23: (0.3.10) Added datatype to sensor values -> Allows datetime and string (e.g. time of last received data from ispindle plugin or alarmtimer)
- 07.03.23: (0.3.7) Added Power Slider for Actors
- 17.02.23: (0.3.6) Fix Bug in Grafana Widget | Add text property timeframe to Grafana widget (e.g. now-2h or now-7d 2023-02-17 12:00 can be entered)
- 01.02.23: (0.3.2) Bump Version to release
- 29.01.23: (0.3.2.rc6) Axis styling on analytics page adapted to allow for better reading
- 28.01.23: (0.3.2.rc5) Togglebutton import changed to new requirements on analytics page
- 27.01.23: (0.3.2.rc4) Fixed bug for sensor action, added hover effect on steps and fermentersteps, added gui version info on about page
- 26.01.23: (0.3.2.rc2) Replaced some deprecated functions and adapted style for step/fermenterstep widget
- 23.01.23: (0.3.2.b5) Fixed sensor digits of harware table to 1
- 22.01.23: (0.3.2.b4) Merged pull request [#30](https://github.com/avollkopf/craftbeerpi4-ui/pull/30) and removed unused imports
- 20.01.23: (0.3.2.b1) Some bugs fixed where reload page via browser caused an issue (e.g. settings page)
- 08.01.23: (0.3.2.a5) Some style updates
- 06.01.23: (0.3.2.a2) UI migrated to @mui V5 and react 18.2.0 (Alpha version not officially released)
- 05.01.23: (0.3.0.a1) UI migrated to React Router V6 (Alpha version not officially released)
- 10.12.22: (0.2.3) Some updates, fixes and additional features
- 12.05.22: (0.2.2) First working release
