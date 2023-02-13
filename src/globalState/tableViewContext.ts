import React from "react";

export type TypeTableView = "drive" | "archive";

type ContextTableType = {
    type: string,
    updateType: (newType: string) => void
}

export const TableViewContext: React.Context<ContextTableType> = React.createContext({
    type: "drive",
    updateType: (_: string) => {}
})