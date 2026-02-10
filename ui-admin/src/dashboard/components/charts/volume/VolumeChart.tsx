import { Box, Typography, Card, CardContent } from "@mui/material";
import { VolumeSummary } from "./VolumeSummary";
import { VolumeBar } from "./VolumeBar";
import { VolumeData } from "./types";
import { VOLUME_CHART_LABELS as L } from "./labels";

interface Props {
    data: VolumeData;
}

export const VolumeChart = ({ data }: Props) => {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    {L.title}
                </Typography>

                <VolumeSummary data={data} />

                {/* Gráfico */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "space-between",
                        mt: 3,
                    }}
                >
                    {data.days.map((d) => (
                        <VolumeBar key={d.day} item={d} />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
