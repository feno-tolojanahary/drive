import React from "react";

export type TypeTableView = "drive" | "archive";

export type ContextTableType = {
    type: string,
    updateType: (newType: string) => void
}

const TableViewContext: React.Context<ContextTableType> = React.createContext({
    type: "drive",
    updateType: (_: string) => {}
})

export default TableViewContext;