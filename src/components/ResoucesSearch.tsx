import { useState } from 'react';
import { Workspace } from '../types/workspace';
// import { useLazyGetWorkspaceResourcesQuery } from '../redux/features/resource/resourceApi';
import { useResourceSearchMutation } from '../redux/features/rag/ragApi';
import sanitizeHtml from 'sanitize-html';

interface ResourcesSearchProps {
    workspace: Workspace;
}

interface ResourceSearchDataSchema {
    query: string;
    workspace: string;
}

const ResourcesSearch = ({ workspace }: ResourcesSearchProps) => {
    const [searchData, setSearchData] = useState<ResourceSearchDataSchema>({
        query: '',
        workspace: workspace.name,

    });
    const [resourceSearch, { isLoading, isError, data, error }] = useResourceSearchMutation();
    // const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    // const [getWorkspaceResources, { data: workspaceResources }] = useLazyGetWorkspaceResourcesQuery();



    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchData.query) return;
        console.log(searchData);
        resourceSearch({ workspace_id: workspace.id, body: searchData });
    };

    // useEffect(() => {
    //     if (workspaceId) {
    //         getWorkspaceResources(workspaceId);
    //     }
    // }, [workspaceId]);

    // useEffect(() => {
    //     if (workspaceResources) {
    //         const filtered = workspaceResources.filter((resource: Resource) => {
    //             const searchLower = searchTerm.toLowerCase();
    //             return (
    //                 resource.name.toLowerCase().includes(searchLower) ||
    //                 resource.description?.toLowerCase().includes(searchLower) ||
    //                 resource.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    //             );
    //         });
    //         setFilteredResources(filtered);
    //     }
    // }, [searchTerm, workspaceResources]);

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="space-y-2">
                <textarea
                    value={searchData.query}
                    onChange={(e) => setSearchData({ ...searchData, query: e.target.value })}
                    placeholder={`Search resources and items...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                    rows={3}
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                    Search
                </button>
            </form>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error.message || 'An error occurred'}</p>}
            {data && data.success && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(data.response, {
                            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['div']),
                            allowedClasses: {
                                '*': ['*'] // Allow all classes - be careful with this in production
                            }
                        })
                    }}
                />
            )}
            {/* <div className="relative">
                <input
                    type="text"
                    placeholder="Search resources by name, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                )}
            </div> */}

            <div className="space-y-2">
                {/* {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <div key={resource.id} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-lg">{resource.name}</h3>
                            {resource.description && (
                                <p className="text-gray-600 mt-1">{resource.description}</p>
                            )}
                            {resource.tags && resource.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {resource.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        {searchTerm ? 'No matching resources found' : 'Start typing to search resources'}
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default ResourcesSearch;