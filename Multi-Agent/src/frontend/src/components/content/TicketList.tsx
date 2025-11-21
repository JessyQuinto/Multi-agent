import React from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    TableCellLayout,
    Badge,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import { DocumentPdfRegular, CalendarClockRegular, MoneyHandRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: tokens.shadow2,
    },
    headerCell: {
        fontWeight: 600,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2,
        padding: '16px',
    },
    row: {
        transition: 'background-color 0.2s ease',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover,
        },
    },
    cell: {
        padding: '16px',
        fontSize: tokens.fontSizeBase300,
    },
    serviceName: {
        fontWeight: 600,
        color: tokens.colorNeutralForeground1,
    },
    dateText: {
        color: tokens.colorNeutralForeground2,
    },
    idText: {
        fontFamily: 'monospace',
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
    },
});

interface Ticket {
    id: string;
    service: string;
    date: string;
    status: 'Completed' | 'Pending' | 'In Progress';
}

const mockTickets: Ticket[] = [
    { id: 'REQ-001', service: 'Certificado Laboral', date: '2024-05-20', status: 'Completed' },
    { id: 'REQ-002', service: 'Solicitud Vacaciones', date: '2024-05-18', status: 'Pending' },
    { id: 'REQ-003', service: 'Consulta Nómina', date: '2024-05-15', status: 'Completed' },
];

export const TicketList: React.FC = () => {
    const styles = useStyles();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed':
                return <Badge appearance="filled" color="success">Completado</Badge>;
            case 'Pending':
                return <Badge appearance="filled" color="warning">Pendiente</Badge>;
            case 'In Progress':
                return <Badge appearance="filled" color="brand">En Proceso</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getIcon = (service: string) => {
        if (service.includes('Certificado')) return <DocumentPdfRegular />;
        if (service.includes('Vacaciones')) return <CalendarClockRegular />;
        if (service.includes('Nómina')) return <MoneyHandRegular />;
        return <DocumentPdfRegular />;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.root}>
            <Table aria-label="Historial de Solicitudes" className={styles.table}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell className={styles.headerCell}>Servicio</TableHeaderCell>
                        <TableHeaderCell className={styles.headerCell}>Fecha</TableHeaderCell>
                        <TableHeaderCell className={styles.headerCell}>Estado</TableHeaderCell>
                        <TableHeaderCell className={styles.headerCell}>ID</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockTickets.map((item) => (
                        <TableRow key={item.id} className={styles.row}>
                            <TableCell className={styles.cell}>
                                <TableCellLayout media={getIcon(item.service)}>
                                    <span className={styles.serviceName}>{item.service}</span>
                                </TableCellLayout>
                            </TableCell>
                            <TableCell className={styles.cell}>
                                <span className={styles.dateText}>{formatDate(item.date)}</span>
                            </TableCell>
                            <TableCell className={styles.cell}>
                                {getStatusBadge(item.status)}
                            </TableCell>
                            <TableCell className={styles.cell}>
                                <span className={styles.idText}>{item.id}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
