import React from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeColor } from '../ENV Values/envValues';
const ModeledDataGrid = styled.div`
  .css-yrdy0g-MuiDataGrid-columnHeaderRow {
    display: flex;
    background-color: ${props => props.primaryColor || ThemeColor.Color}; 
    color: white;
  }
`;
function ModeldedTable({ rows, columns, primaryColor }) {
    return (
        <ModeledDataGrid primaryColor={primaryColor}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            // autoHeight
            // disableColumnFilter
            pageSizeOptions={[5, 10]}
            // components={{
            //   NoRowsOverlay: () => (
            //     <div style={{ width: '100%' }}>No data found</div>
            //   ),
            // }}
          />
        </ModeledDataGrid>
      );
}

export default ModeldedTable
