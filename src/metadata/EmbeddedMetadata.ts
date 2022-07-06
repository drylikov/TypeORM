import {ColumnMetadata} from "./ColumnMetadata";
import {RelationMetadata} from "./RelationMetadata";
import {EntityMetadata} from "./EntityMetadata";
import {EmbeddedMetadataArgs} from "../metadata-args/EmbeddedMetadataArgs";
import {RelationIdMetadata} from "./RelationIdMetadata";
import {RelationCountMetadata} from "./RelationCountMetadata";
import {Connection} from "../connection/Connection";
import {MongoDriver} from "../driver/mongodb/MongoDriver";

/**
 * Contains all information about entity's embedded property.
 */
export class EmbeddedMetadata {

    // ---------------------------------------------------------------------
    // Public Properties
    // ---------------------------------------------------------------------

    /**
     * Entity metadata where this embedded is.
     */
    entityMetadata: EntityMetadata;

    /**
     * Parent embedded in the case if this embedded inside other embedded.
     */
    parentEmbeddedMetadata?: EmbeddedMetadata;

    /**
     * Embedded target type.
     */
    type: Function;

    /**
     * Property name on which this embedded is attached.
     */
    propertyName: string;

    /**
     * Columns inside this embed.
     */
    columns: ColumnMetadata[] = [];

    /**
     * Relations inside this embed.
     */
    relations: RelationMetadata[] = [];

    /**
     * Nested embeddable in this embeddable (which has current embedded as parent embedded).
     */
    embeddeds: EmbeddedMetadata[] = [];

    /**
     * Indicates if this embedded is in array mode.
     *
     * This option works only in monogodb.
     */
    isArray: boolean = false;

    /**
     * Prefix of the embedded, used instead of propertyName.
     * If set to empty string, then prefix is not set at all.
     */
    customPrefix: string|boolean|undefined;

    /**
     * Gets the prefix of the columns.
     * By default its a property name of the class where this prefix is.
     * But if custom prefix is set then it takes its value as a prefix.
     * However if custom prefix is set to empty string prefix to column is not applied at all.
     */
    prefix: string;

    /**
     * Returns array of property names of current embed and all its parent embeds.
     *
     * example: post[data][information][counters].id where "data", "information" and "counters" are embeds
     * we need to get value of "id" column from the post real entity object.
     * this method will return ["data", "information", "counters"]
     */
    parentPropertyNames: string[] = [];

    /**
     * Returns embed metadatas from all levels of the parent tree.
     *
     * example: post[data][information][counters].id where "data", "information" and "counters" are embeds
     * this method will return [embed metadata of data, embed metadata of information, embed metadata of counters]
     */
    embeddedMetadataTree: EmbeddedMetadata[] = [];

    /**
     * Embed metadatas from all levels of the parent tree.
     *
     * example: post[data][information][counters].id where "data", "information" and "counters" are embeds
     * this method will return [embed metadata of data, embed metadata of information, embed metadata of counters]
     */
    columnsFromTree: ColumnMetadata[] = [];

    /**
     * Relations of this embed and all relations from its child embeds.
     */
    relationsFromTree: RelationMetadata[] = [];

    /**
     * Relation ids of this embed and all relation ids from its child embeds.
     */
    relationIdsFromTree: RelationIdMetadata[] = [];

    /**
     * Relation counts of this embed and all relation counts from its child embeds.
     */
    relationCountsFromTree: RelationCountMetadata[] = [];

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor(options: {
        entityMetadata: EntityMetadata,
        args: EmbeddedMetadataArgs,
    }) {
        this.entityMetadata = options.entityMetadata;
        this.type = options.args.type();
        this.propertyName = options.args.propertyName;
        this.customPrefix = options.args.prefix;
        this.isArray = options.args.isArray;
    }

    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------

    /**
     * Creates a new embedded object.
     */
    create(): any {
        return new (this.type as any);
    }

    // ---------------------------------------------------------------------
    // Builder Methods
    // ---------------------------------------------------------------------

    build(connection: Connection): this {
        this.embeddeds.forEach(embedded => embedded.build(connection));
        this.prefix = this.buildPrefix(connection);
        this.parentPropertyNames = this.buildParentPropertyNames();
        this.embeddedMetadataTree = this.buildEmbeddedMetadataTree();
        this.columnsFromTree = this.buildColumnsFromTree();
        this.relationsFromTree = this.buildRelationsFromTree();
        return this;
    }

    // ---------------------------------------------------------------------
    // Protected Methods
    // ---------------------------------------------------------------------

    protected buildPrefix(connection: Connection): string {
        if (connection.driver instanceof MongoDriver)
            return this.propertyName;

        let prefixes: string[] = [];
        if (this.parentEmbeddedMetadata)
            prefixes.push(this.parentEmbeddedMetadata.buildPrefix(connection));

        if (this.customPrefix === undefined) {
            prefixes.push(this.propertyName);

        } else if (typeof this.customPrefix === "string") {
            prefixes.push(this.customPrefix);
        }

        return prefixes.join("_"); // todo: use naming strategy instead of "_"  !!!
    }

    protected buildParentPropertyNames(): string[] {
        return this.parentEmbeddedMetadata ? this.parentEmbeddedMetadata.buildParentPropertyNames().concat(this.propertyName) : [this.propertyName];
    }

    protected buildEmbeddedMetadataTree(): EmbeddedMetadata[] {
        return this.parentEmbeddedMetadata ? this.parentEmbeddedMetadata.buildEmbeddedMetadataTree().concat(this) : [this];
    }

    protected buildColumnsFromTree(): ColumnMetadata[] {
        return this.embeddeds.reduce((columns, embedded) => columns.concat(embedded.buildColumnsFromTree()), this.columns);
    }

    protected buildRelationsFromTree(): RelationMetadata[] {
        return this.embeddeds.reduce((relations, embedded) => relations.concat(embedded.buildRelationsFromTree()), this.relations);
    }

}