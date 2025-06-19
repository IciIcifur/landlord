export function transformMongooseDoc(doc: any): any {
  if (!doc) return doc;
  if (Array.isArray(doc)) {
    return doc.map(transformMongooseDoc);
  }
  if (doc._id) {
    const transformed = { ...doc };
    transformed.id = doc._id.toString();
    delete transformed._id;
    delete transformed.__v;
    return transformed;
  }
  return doc;
}
