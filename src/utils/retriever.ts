import { initVectorStore } from "../connections/vectorstore.connection";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { promptTemplate } from "../utils/prompt-template";
import LLM from "../ml-models/openai.model";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { openAiEmbedder } from "../ml-models/embedder.model";


async function* retrieve(query: string, index: string) {
    const vectorStore = await initVectorStore(index,openAiEmbedder);
    const retriever = vectorStore.asRetriever({ k: 10, searchType: "similarity" });
    const context = await retriever.invoke(query);

    const enhancedContext = context.map((retrievedDoc) => {
        retrievedDoc.pageContent += "\n source : " + retrievedDoc.metadata.source;
        return {
            ...retrievedDoc,
        };
    });

    const retrieverChain = await createStuffDocumentsChain({
        llm: LLM,
        prompt: promptTemplate,
        outputParser: new StringOutputParser(),
    });

    const response = await retrieverChain.stream({
        question: query,
        context: enhancedContext,
    });

    for await (const chunk of response) {
        yield {
            query,
            answer: chunk,
        };
    }
}

export default retrieve;