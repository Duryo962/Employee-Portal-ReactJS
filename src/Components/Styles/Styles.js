import styled from 'styled-components';
import { ThemeColor } from '../ENV Values/envValues';

// Table styles
export const TableStyles = styled.div`
    .css-yrdy0g-MuiDataGrid-columnHeaderRow {
        display: flex;
        background-color: ${ThemeColor.Color};
        color: white;
    }
`;

// Button styles
export var RefreshButtonDivStyle = {
    display: 'flex',
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
};

export var RefreshButtonStyles = {
    backgroundColor:ThemeColor.Color,
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor:ThemeColor.Color,
    },
    textTransform: 'none',
    fontFamily: 'Sans-serif',
};

// Headings styles
export var HeadingsStyles = {
    color:ThemeColor.Color,
    fontFamily: 'emoji',
    fontSize: '2em',
    fontWeight: 'bold',
};

// Cancel button styles
export var CancelButtonStyles = {
    backgroundColor: '#c71f2e',
    '&:hover': {
        backgroundColor: '#c71f2e',
    },
    color: '#FFFFFF',
};
