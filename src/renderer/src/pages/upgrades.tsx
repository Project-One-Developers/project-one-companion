import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";

export default function RosterPage() {
    const [players, setPlayers] = React.useState([]);

    useEffect(() => {
        const players =
            JSON.parse(window.localStorage.getItem("players") ?? "") || [];
        setPlayers(players);
    }, []);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Character</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* {players.map((player) => (
                    <TableRow
                        key={player.name}
                        style={{
                            backgroundColor: classColors.get(player.class),
                            color:
                                player.class === "Priest" ? "black" : "white",
                        }}
                    >
                        <TableCell className="font-medium">
                            {player.name}
                        </TableCell>
                        <TableCell>{player.character}</TableCell>
                        <TableCell>{player.class}</TableCell>
                        <TableCell className="text-right">
                            {player.role}
                        </TableCell>
                    </TableRow>
                ))} */}
            </TableBody>
        </Table>
    );
}
