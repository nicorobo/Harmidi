// import { Stack } from '@mui/joy'
// import { useStore } from '../../store'
// import { ChordFamilyZoneSettings } from '../../zone-settings'
// import { KeyTypeInput, RootNoteInput, SharedSettings } from './SharedSettings'

// export const ChordFamilySettings = ({
//   settings,
//   zoneIndex,
// }: {
//   settings: ChordFamilyZoneSettings
//   zoneIndex: number
// }) => {
//   const updateZoneSettings = useStore((state) => state.updateZoneSettings)
//   // const updateRowType = useStore((state) => state.updateZoneType)
//   const onUpdate = (update: Partial<ChordFamilyZoneSettings>) => {
//     updateZoneSettings(zoneIndex, { ...settings, ...update })
//   }
//   return (
//     <Stack spacing={2}>
//       <SharedSettings settings={settings} onUpdate={onUpdate} />
//       <RootNoteInput
//         value={settings.key.root}
//         onChange={(root) => onUpdate({ key: { ...settings.key, root } })}
//       />
//       <KeyTypeInput
//         value={settings.key.type}
//         onChange={(type) => onUpdate({ key: { ...settings.key, type } })}
//       />
//     </Stack>
//   )
// }
