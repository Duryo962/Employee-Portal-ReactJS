// StyledDataGrid.jsx
import React from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeColor } from '../ENV Values/envValues';

// Define a styled component for the DataGrid
const StyledDataGridContainer = styled.div`
  .css-yrdy0g-MuiDataGrid-columnHeaderRow {
    display: flex;
    background-color: ${props => props.primaryColor || ThemeColor.Color}; 
    color: white;
  }
`;

const StyledDataGrid = ({ rows, columns, primaryColor }) => {
  return (
    <StyledDataGridContainer primaryColor={primaryColor}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        autoHeight
        disableColumnFilter
        pageSizeOptions={[5, 10]}
        components={{
          NoRowsOverlay: () => (
            <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>No data found</div>
          ),
        }}
      />
    </StyledDataGridContainer>
  );
};

export default StyledDataGrid;
