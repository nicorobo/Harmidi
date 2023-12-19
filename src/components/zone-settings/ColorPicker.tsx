import { Box, Dropdown, Menu, MenuButton } from '@mui/joy'
import Compact from '@uiw/react-color-compact'

type Props = {
  color: string
  onChange: (color: string) => void
}

export const ColorPicker: React.FC<Props> = ({ color, onChange }) => {
  return (
    <Dropdown>
      <MenuButton size="sm" slots={{ root: 'div' }} sx={{ display: 'flex' }}>
        <Box height={25} width={25} borderRadius={'50%'} bgcolor={color}></Box>
      </MenuButton>
      <Menu sx={{ '--ListDivider-gap': 0 }}>
        <Compact
          color={color}
          style={{
            boxShadow:
              'rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px',
          }}
          onChange={(color) => {
            onChange(color.hex)
          }}
        />
      </Menu>
    </Dropdown>
  )
}
