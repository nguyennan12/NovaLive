import PersonIcon from '@mui/icons-material/Person'
import { Box, Paper } from '@mui/material'
import { useMemo, useState } from 'react'
import { formatDate } from '~/common/utils/formatters'
import SectionTitle from '../shared/SectionTitle'
import InfoRow from '../shared/InfoRow'
import EditInfoDialog from './EditInfoDialog'
import { glassSx } from '~/theme'

const GENDER_LABEL = { male: 'Nam', female: 'Nữ', other: 'Khác' }

const buildRows = (profile) => [
  { label: 'Họ và tên', value: profile?.user_name, field: 'user_name', editLabel: 'Họ và tên' },
  {
    label: 'Email',
    value: profile?.user_email,
    verified: profile?.isVerified ?? true,
    field: null
  },
  {
    label: 'Số điện thoại',
    value: profile?.user_phone,
    verified: profile?.user_phone ? (profile?.phone_verified ?? false) : undefined,
    field: 'user_phone',
    editLabel: 'Số điện thoại'
  },
  {
    label: 'Giới tính',
    value: GENDER_LABEL[profile?.user_gender] ?? null,
    field: 'user_gender',
    editLabel: 'Giới tính'
  },
  {
    label: 'Ngày sinh',
    value: profile?.user_birthday ? formatDate(profile.user_birthday) : null,
    field: 'user_birthday',
    editLabel: 'Ngày sinh',
    rawValue: profile?.user_birthday?.slice(0, 10)
  },
  { label: 'Địa chỉ mặc định', value: profile?.default_address?.full_address, field: null }
]

const PersonalInfoCard = ({ profile, isLoading, onSave, isSaving }) => {
  const [editField, setEditField] = useState(null)

  const rows = useMemo(() => buildRows(profile), [profile])

  const openEdit = (field, editLabel, rawValue) =>
    setEditField({ field, label: editLabel, currentValue: rawValue ?? profile?.[field] })

  const closeEdit = () => setEditField(null)

  const handleSave = (data) => onSave(data, { onSuccess: closeEdit })

  return (
    <>
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: 'primary.main', border: '1px solid', borderColor: 'divider', ...glassSx }}
      >
        <SectionTitle title="Thông tin cá nhân" icon={PersonIcon} />
        <Box>
          {rows.map(({ label, value, verified, field, editLabel, rawValue }) => (
            <InfoRow
              key={label}
              label={label}
              value={value}
              verified={verified}
              onEdit={field ? () => openEdit(field, editLabel, rawValue) : undefined}
              loading={isLoading}
            />
          ))}
        </Box>
      </Paper>

      {editField && (
        <EditInfoDialog
          open
          onClose={closeEdit}
          field={editField.field}
          label={editField.label}
          currentValue={editField.currentValue}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </>
  )
}

export default PersonalInfoCard
