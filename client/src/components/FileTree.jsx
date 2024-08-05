const FileTreeNode = ({ filename, nodes }) => {
    return (
        <div className="ml-4">
            {filename}
            {nodes && 
                <ul>
                    {Object.keys(nodes).map(child => (
                        <li key={child}>
                            <FileTreeNode filename={child} nodes={nodes[child]} />
                        </li>
                    ))}
                </ul>}
        </div>
    );
}

// eslint-disable-next-line react/prop-types
const FileTree = ({ tree }) => {
    return (
        <FileTreeNode 
            filename={"/"}
            nodes={tree}
        />
    );
}

export default FileTree