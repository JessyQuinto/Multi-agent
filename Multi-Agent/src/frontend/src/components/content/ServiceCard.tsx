import React from 'react';
import { Card, CardHeader, CardFooter, Button, Text, makeStyles } from '@fluentui/react-components';
import { ArrowRightRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    card: {
        width: '300px',
        maxWidth: '100%',
        height: 'fit-content',
    },
    description: {
        margin: '12px 0',
    },
});

interface ServiceCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, onClick }) => {
    const styles = useStyles();

    return (
        <Card className={styles.card}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={<Text size={200}>{description}</Text>}
                {...((icon) ? { image: { as: 'div', children: icon } } : {})}
            />
            <CardFooter>
                <Button icon={<ArrowRightRegular />} onClick={onClick}>
                    Solicitar
                </Button>
            </CardFooter>
        </Card>
    );
};
