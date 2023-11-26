// import { Stack } from '@mui/joy'
// import { useStore } from '../../store'
// import { ChordZoneSettings } from '../../zone-settings'
// import { ChordInput, SharedSettings, TranslateInput } from './SharedSettings'

// export const ChordSettings = ({
//   settings,
//   zoneIndex,
// }: {
//   settings: ChordZoneSettings
//   zoneIndex: number
// }) => {
//   const updateZoneSettings = useStore((state) => state.updateZoneSettings)
//   const onUpdate = (update: Partial<ChordZoneSettings>) => {
//     updateZoneSettings(zoneIndex, { ...settings, ...update })
//   }
//   return (
//     <Stack spacing={2}>
//       <SharedSettings settings={settings} onUpdate={onUpdate} />
//       <ChordInput
//         value={settings.family}
//         onChange={(family) => onUpdate({ family })}
//       />
//       <TranslateInput
//         value={settings.translate}
//         onChange={(translate) => onUpdate({ translate })}
//       />
//     </Stack>
//   )
// }
