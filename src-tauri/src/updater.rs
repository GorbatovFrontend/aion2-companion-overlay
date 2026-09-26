use serde::Deserialize;
use std::collections::HashSet;

#[derive(Debug, Deserialize)]
pub(crate) struct DataPackage { pub schema_version:u32,pub provider_id:String,pub version:String,pub records:Vec<DataRecord> }
#[derive(Debug, Deserialize)]
pub(crate) struct DataRecord { pub id:String,pub entity_type:String,pub name_en:String }

pub(crate) fn validate_package(package:&DataPackage,previous_count:usize)->Result<(),String>{
    if package.schema_version!=1{return Err("unsupported schema version".into())}
    if package.provider_id.len()>64||package.version.len()>128{return Err("oversized metadata".into())}
    if package.records.len()>1_000_000{return Err("record limit exceeded".into())}
    if previous_count>=100&&package.records.len()<previous_count/2{return Err("suspicious record count drop".into())}
    let mut ids=HashSet::new();for record in &package.records{if record.id.is_empty()||record.id.len()>128||record.name_en.trim().is_empty(){return Err("missing or malformed required field".into())}if !matches!(record.entity_type.as_str(),"item"|"skill"|"class"|"instance"|"boss"|"build"|"guide"|"recommendation"){return Err("unexpected entity type".into())}if !ids.insert((&record.entity_type,&record.id)){return Err("duplicate provider id".into())}}
    Ok(())
}

#[cfg(test)]mod tests{use super::*;#[test]fn rejects_truncated_dataset(){let package=DataPackage{schema_version:1,provider_id:"x".into(),version:"1".into(),records:vec![]};assert!(validate_package(&package,9450).is_err())}#[test]fn rejects_duplicate_ids(){let row=||DataRecord{id:"1".into(),entity_type:"item".into(),name_en:"Item".into()};let package=DataPackage{schema_version:1,provider_id:"x".into(),version:"1".into(),records:vec![row(),row()]};assert!(validate_package(&package,0).is_err())}}
