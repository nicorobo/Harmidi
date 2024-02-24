# Harmidi

**Harmidi** is an in-browser MIDI controller that turns your computer
keyboard into a multi-instrument workstation. Built for traveling
musicians and harmony magicians, it offers a flexible and intuitive
way to explore musical ideas while on the go or in the studio.

## Zones

A Zone is a group of keys that share settings.

- Create a new zone by pressing on the "+" icon in the sidebar.
- Delete a zone by clicking the trash icon in the zone panel.
- Rename a zone by clicking on the name in the zone panel.
- Add keys to a zone by enabling key mapping mode with the switch on the bottom of the sidebar. After pressing the keys you would like to add, disable key mapping mode.

## Zone Settings

| Setting    | Description                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| Instrument | Select a built-in sound for testing _(if MIDI is disabled)_                                                   |
| Channel    | Select the zone's MIDI channel _(if MIDI is enabled)_                                                         |
| Order      | Choose the order of the zone's progression. Default is left-to-right, top-to-bottom.                          |
| Hold       | When enabled, keys in this zone will act as switches, remaining held until pressed again.                     |
| Velocity   | Choose the zone's note velocity                                                                               |
| Octave     | Increase or decrease the zone's octave                                                                        |
| Transpose  | Transpose the zone's notes up or down                                                                         |
| Mute       | Zones Select zones to mute when a key is pressed. It is suggested a zone mutes itself when playing > 1 voice. |
| Voices     | Select from a list of chords, or build your own by adding up to 8 voices.                                     |
| Quantize   | Select from a list of scales, or create your own. Voices will be quantized to the nearest note in the scale.  |

## Notes

- Harmidi was developed as a MIDI controller; built-in sounds are meant for demo purposes and may appear sluggish or behave in unexpected ways.
- Many keyboards have a limit to the amount of simultaneous key presses they can detect.
  [Find out more here.](https://en.wikipedia.org/wiki/Key_rollover)
- If you would like to control virtual MIDI devices or DAWs (such as Ableton Live, Logic Pro, etc.), you will need to setup a virtual MIDI driver.
  [This article explains how.](https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus)
