import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddPeriod } from "../../../../domain/usecase";
import React from "react";

type Props = {
  title: string
  data: AddPeriod.RemoteAddPeriodCategory[]
  onAdd: (category: AddPeriod.RemoteAddPeriodCategory) => void
}

const MasterDetail: React.FC<Props> = (props: Props) => {
  const [category, setCategory] = React.useState<AddPeriod.RemoteAddPeriodCategory | null>(null)

  const handleAddCategory = () => {
    props.onAdd(category as AddPeriod.RemoteAddPeriodCategory)
    setCategory(null)
  }

  return (
    <>
      <div className='master-detail'>
        <div className="master-detail-content">
          <div className="master-detail-header">
            <div className="master-detail-title">
              <span>{props.title}</span>
            </div>

            <div className='master-detail-info'>
              <IconButton 
                size='small'
                style={{
                  color: '#fff'
                }}
                onClick={handleAddCategory}
              >
                <AddCircleOutlineIcon/>
              </IconButton>
            </div>
          </div>

          <div className="master-detail-body">
            <Table 
              className='table'
              border={1}
            >
              <TableHead>
                <TableRow>
                  <TableCell className='column'>Name</TableCell>
                  <TableCell className='column'>Budget</TableCell>
                  <TableCell className='column'>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {props.data.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell className='column'>{category.category.name}</TableCell>
                    <TableCell className='column'>{category.budget}</TableCell>
                    <TableCell className='column'></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}

export default MasterDetail
