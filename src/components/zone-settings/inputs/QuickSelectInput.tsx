import React from 'react'
import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'

export const QuickSelectInput = ({
  options,
  onSelect,
  buttonContent,
}: {
  options: string[]
  onSelect: (option: string) => void
  buttonContent: React.ReactNode
}) => {
  return (
    <Dropdown>
      <MenuButton size="sm">{buttonContent}</MenuButton>
      <Menu size="sm" sx={{ maxHeight: 200, overflow: 'auto' }}>
        {options.map((option) => (
          <MenuItem key={option} onClick={() => onSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  )
}
