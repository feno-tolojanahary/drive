import { AxiosResponse } from "axios";
import moment from "moment";
import React from "react";
import { useState, useEffect } from "react";
import { Column } from "react-table";
import { DocumentRow } from "../../server/src/common/interfaces/document";
import TableView from "../components/TableView";
import RecentService from "../services/RecentService";

const Recent = () => {
    const [recents, setRecents] = useState<DocumentRow[]>([])

    useEffect(() => {
        RecentService.getRecent()
        .then((res: AxiosResponse) => {
            setRecents(res.data)
        }).catch((err: Error) => {
            console.log("Error get recent: ", err.message);
        })

    }, [])

    const columns: Column<DocumentRow>[]  = React.useMemo(() => {
        return [
            {
                Header: "Name",
                accessor: 'name'
            },
            {
                Header: "Size",
                accessor: "size"
            },
            {
                Header: "Date binned",
                accessor: "archive",
                Cell: ({ value }) => <>{moment(value?.createdAt).format("Do MMM YYYY")}</>
            },
            {
                Header: "Original location",
                accessor: "parent",
                Cell: ({ value }) => <>{value ? value.name : "-"}</>
            }
        ]
    // eslint-disable-next-line
    }, [])  


    return (
        <TableView 
            columns={columns}
            documents={recents}
        />
    )
}

export default Recent;